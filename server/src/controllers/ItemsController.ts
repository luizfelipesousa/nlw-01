import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const item = await knex('items').where('id', id).first();

        if (!item) {
            return response.json({ message: "Item not found" });
        }

        return response.json(item);
    }

    async index(request: Request, response: Response) {

        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                name: item.title,
                // url_image: `http://localhost:3333/uploads/${item.image}`,
                url_image: `http://192.168.1.109:3333/uploads/${item.image}`,
            };
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;