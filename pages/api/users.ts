import { NextApiRequest, NextApiResponse } from 'next';
import { User } from './types'; // J'importe l'interface User depuis le fichier types.ts
import { users } from '../../mockData';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Pagination
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // J'obtiens les utilisateurs paginés en fonction des paramètres de requête
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Tri des utilisateurs par nom
    paginatedUsers.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      users: paginatedUsers,
      totalUsers: users.length, // J'envoie le nombre total d'utilisateurs dans la réponse
    });
  }

  // Si une autre méthode HTTP est utilisée (POST, PUT, DELETE), je renvoie une réponse "Méthode non autorisée".
  return res.status(405).end(); // Méthode non autorisée.
};
