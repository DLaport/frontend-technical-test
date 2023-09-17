'use client'

import React, { useState, useEffect } from 'react';
import { users } from '../mockData';
import { User } from '../pages/api/types';

// Je définis le composant UserTable
const UserTable: React.FC = () => {
  // J'initialise les états avec les données de base
  const [userData, setUserData] = useState<User[]>(users);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(userData);
  const [loading, setLoading] = useState(true); // Je démarre en mode "chargement"
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const usersPerPage = 10;

  // Utilisation de useEffect pour simuler un chargement initial des données
  useEffect(() => {
    setTimeout(() => {
      setUserData(users);
      setFilteredUsers(users);
      setLoading(false); // Je désactive le mode "chargement" après 1 seconde
    }, 1000); // J'attends 1 seconde pour simuler le chargement initial
  }, []);

  // Mettez à jour filteredUsers en fonction de la barre de recherche
  useEffect(() => {
    const filtered = userData.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, userData]);

  // Calcul des indices des utilisateurs actuellement affichés
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Tri des utilisateurs en fonction de la configuration de tri actuelle
  const sortedUsers = filteredUsers.slice().sort((a, b) => {
    if (sortConfig === null) return 0;
    const key = sortConfig.key;
    if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  // Sélection des utilisateurs actuellement affichés
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Fonction pour demander un tri de colonne
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Fonction pour obtenir les classes CSS de tri pour une colonne donnée
  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return; // Si aucune configuration de tri n'est définie, je ne retourne rien
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Fonction pour gérer la page précédente
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fonction pour gérer la page suivante
  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fonction pour mettre à jour le nom d'utilisateur
  const handleUpdateUsername = () => {
    if (selectedUserId !== null) {
      const updatedUsers = userData.map((user) =>
        user.id === selectedUserId ? { ...user, name: newUsername } : user
      );
      setUserData(updatedUsers); // Mettez à jour userData avec les modifications
      setFilteredUsers(updatedUsers); // Mettez à jour filteredUsers avec les modifications
      setIsUpdateDialogOpen(false);
    }
  };

  // Rendu du composant
  return (
    <div className="container mx-auto mt-8 p-4">
      {/* Affichage du spinner de chargement si loading est true */}
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          const filtered = userData.filter((user) =>
            user.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setFilteredUsers(filtered);
          setCurrentPage(1);
        }}
        className="p-2 rounded-lg border border-gray-400 mb-4 w-full"
      />
      {/* Tableau des utilisateurs */}
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {/* Colonne Nom avec gestion du tri */}
            <th
              className={`py-2 px-4 font-semibold text-left ${getClassNamesFor(
                'name'
              )}`}
              onClick={() => requestSort('name')}
            >
              Nom
            </th>
            {/* Colonne Email avec gestion du tri */}
            <th
              className={`py-2 px-4 font-semibold text-left ${getClassNamesFor(
                'email'
              )}`}
              onClick={() => requestSort('email')}
            >
              Email
            </th>
            {/* Colonne Type avec gestion du tri */}
            <th
              className={`py-2 px-4 font-semibold text-left ${getClassNamesFor(
                'type'
              )}`}
              onClick={() => requestSort('type')}
            >
              Type
            </th>
            {/* Colonne Actions */}
            <th className="py-2 px-4 font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {/* Affichage des utilisateurs actuellement visibles */}
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
              </td>
              <td className="py-2 px-4">
                {/* Bouton pour ouvrir la boîte de dialogue de mise à jour */}
                <button
                  onClick={() => {
                    setIsUpdateDialogOpen(true);
                    setSelectedUserId(user.id);
                    setNewUsername(user.name);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        {/* Bouton Page précédente */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-2 rounded-l focus:outline-none focus:shadow-outline-blue"
        >
          Page précédente
        </button>
        {/* Affichage du numéro de page actuelle */}
        <span className="py-1 px-2 bg-gray-200 text-gray-600">
          Page {currentPage}
        </span>
        {/* Bouton Page suivante */}
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredUsers.length / usersPerPage)
          }
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-2 rounded-r focus:outline-none focus:shadow-outline-blue"
        >
          Page suivante
        </button>
      </div>
      {/* Boîte de dialogue de mise à jour du nom d'utilisateur */}
      {isUpdateDialogOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Modifier le nom d'utilisateur
            </h2>
            {/* Champ de saisie pour le nouveau nom d'utilisateur */}
            <input
              type="text"
              placeholder="Nouveau nom d'utilisateur"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-400 mb-4"
            />
            {/* Bouton de confirmation */}
            <button
              onClick={handleUpdateUsername}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline-blue"
            >
              Confirmer
            </button>
            {/* Bouton d'annulation */}
            <button
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setSelectedUserId(null);
                setNewUsername('');
              }}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
