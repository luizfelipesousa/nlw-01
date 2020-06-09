import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items).split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            // .where('city', String(city))
            // .where('uf', String(uf))
            .distinct()
            .select('points.*');
        // .select('*');

        const serielizedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.109:3333/uploads/${point.image}`
            }
        });

        return response.json(serielizedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: "Point Not Found" });
        }

        const items = await knex('items').join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id).select('items.title');

        const serielizedPoints = {
            ...point,
            image_url: `http://192.168.1.109:3333/uploads/${point.image}`
        }

        return response.json({ point: serielizedPoints, items });
    }

    async create(request: Request, response: Response) {
        const {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf, items
        } = request.body;

        const point = {
            image: request.file.filename,
            // short-sintaxe - procure o significado',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point);

        const pointId = insertedIds[0];

        const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item: Number) => {
            return {
                item_id: item,
                point_id: pointId,
            }
        });

        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            ...point, pointId
        })
    }

}

export default PointsController;