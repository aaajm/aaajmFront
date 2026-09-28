import {UserService, User} from '@aaajm/client';
import {Component, computed, inject, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-mission',
  imports: [],
  templateUrl: './mission.html',
})
export class Mission {
  userService = inject(UserService);

  userResource = resource({
    loader: (): Promise<User[]> => {
      return firstValueFrom(this.userService.getUsers());
    },
  });

  memberCount = computed(() => {
    if (this.userResource.hasValue()) {
      const users = this.userResource.value() || [];
      return users.length;
    }
    return 0; // Default when loading or if error
  });

  legacyItems = [
    {
      year: '1987',
      title: 'Fondation',
      desc: "L'Association des Anciens et Amis du Japon (AAAJM)MAINTIMOLALIN'I JAPANA TANICHI KEIKENSHA DOSOKAI créée en 1987, est une association nationale malgache, apolitique, non confessionnelle et sans but lucratif. Elle est composée de ressortissants malgaches ayant fait des études, des stages et des missions dans le cadre des programmes bilatéraux nippo-malgaches.",
    },
  ];

  missions = [
    ' Constitue un Organe consultatif concourant au développement économique et technique avec le Japon.',
    ' Une organisme de documentation, de contacts professionnels et techniques ainsi que de transfert technologique.',
    " Une structure de relations avec les organismes japonais pouvant concourir à la réalisation des objectifs de l'Association.",
    " Une structure d'accueil, de conseils et d'aide aux anciens, actuels et futurs étudiant.",
    ' Renseignements : aaajmsecretariat@gmail.com',
    ' tel : +261 34 07 508 05'
  ];
}
