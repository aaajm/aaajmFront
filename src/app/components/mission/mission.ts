import {Component} from '@angular/core';

@Component({
  selector: 'app-mission',
  imports: [],
  templateUrl: './mission.html',
})
export class Mission {
  legacyItems = [
    {
      year: '1987',
      title: 'Fondation',
      desc: "C'est une association nationale malagasy apolitique, non confessionnel et sans but lucratif. \n Elle est composé de nationaux malagasy ayant fait des études, des stges et des missions dans le cadre des programmes bilateraux nippo-malagasy.",
    },
  ];

  missions = [
    'Une Organe consultatif concourant au développement économique et technique avec le Japon.',
    'Une organisme de documentation, de contacts professionnels et techniques ainsi que de transfert technologique.',
    "Une structure de relations avec les organismes japonais pouvant concourir à la réalisation des objectifs de l'Association.",
    "Une structure d'accueil, de conseils et d'aide aux anciens, actuels et futurs étudiant.",
  ];
}
