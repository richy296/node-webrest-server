import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

/* let todos = [
    {id: 1, text: 'Buy milk', completedAt: new Date()},
    {id: 2, text: 'Buy bread', completedAt: null},
    {id: 3, text: 'Buy butter', completedAt: new Date()}
]; */

export class TodosController {
    
    //* Dependency
    constructor() {}

    public getTodos = async (req: Request, res: Response) => {

        const todos = await prisma.todo.findMany();

        return res.json(todos)
    };

    public getTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number`});

        // const todo = todos.find(todo => todo.id === id);

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });

        (todo) 
            ? res.json(todo)
            : res.status(404).json({error: `TODO with id ${id}`})
    };

    public createTodo = async (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) res.status(400).json({error: 'Text property is required'});

        const todo = await prisma.todo.create({
            data: { text }
        })

        res.json(todo);

        /* const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null
        }
        
        todos.push(newTodo);

        res.json(newTodo); */
    };

    public updateTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number`});

        // const todo = todos.find(todo => todo.id === id);
        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if(!todo) return res.status(404).json({error: `TODO with id ${id} not found`});

        const {text, completedAt} = req.body;
        /* (completedAt === null)
            ? todo.completedAt = null : todo.completedAt = new Date(completedAt || todo.completedAt)
        todo.text = text || todo.text; */

        const updatedTodo = await prisma.todo.update({
            where: {id: id},
            data: { 
                text, 
                completedAt: (completedAt) ? new Date(completedAt): null}
        });

        res.json(updatedTodo)
    };

    public deleteTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number`});

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if(!todo) return res.status(404).json({error: `TODO with id ${id} not found`});

        /* const todo = todos.find(todo => todo.id === id);
        if(!todo) return res.status(404).json({error: `TODO with id ${id} not found`});

        // const todosUpdate = todos.filter(todo => todo.id !== id);
        // todos = todosUpdate;

        todos.splice(todos.indexOf(todo), 1); */

        const deleted = await prisma.todo.delete({
            where: { 
                id: id    
            },
            select: {
                id: true,
                text: true
            }
        });
         
        (deleted) 
            ? res.json(deleted)
            : res.status(400).json({error: `Todo with id ${id} not found`})

    };
}