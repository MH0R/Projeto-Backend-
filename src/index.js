

const { request } = require('express');
const express = require('express');
const cors = require('cors')
const app = express();
const { v4: uuid} = require('uuid');
const { validate: uuidValidate} = require('uuid');
app.use(express.json())
app.use(cors());
/* 
* Tipos de parâmetros:
*
* Query Params: Filtros e paginação
* Route Params: Identificar recursos na hora de atualizar/deletar
* Request Params: Conteúdo na hora de criar/editar um recurso (JSON)
*
* Middleware:
* 
* Interceptador de requisições que pode interromper totalmente ou alterar dados da requisição
*/

const projects = []

function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!uuidValidate(id)) {
        return response.status(400).json({error: 'Invalid project ID.'});
    }
    return next();
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const {title} = request.query;
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

    return response.json(results);
});


app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
})

app.put('/projects/:id', (request, response) => {
    const {id} = request.params
    const { title, owner } = request.body
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) {
        response.status(400).json({error: 'Project not found' })
    }
    const project = {
        id,
        title,
        owner,
};
    projects[projectIndex] = project

    return response.json(project)
})

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) {
        response.status(400).json({error: 'Project not found' })
    }
    projects.splice(projectIndex, 1);


    return response.status(204).send()
})

app.listen(3333, () => {
    console.log('🚀️ Back-end Started');
});