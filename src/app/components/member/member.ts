import {User} from '@aaajm/client';
import {Component, Input} from '@angular/core';
import {Image} from 'primeng/image';

@Component({
  selector: 'app-member',
  imports: [Image],
  host: {
    class: 'contents',
  },
  templateUrl: './member.html',
})
export class Member {
  @Input({required: true}) member?: User;
  members = [
    {
      name: 'Julian Thorne',
      role: 'CHIEF ARCHIVIST',
      location: 'London, UK',
      email: 'example@gmail.com',
      phone: '+44 123 456 7890',
      img: 'https://i.pravatar.cc/150?u=julian',
    },
    {
      name: 'Elena Rostova',
      role: 'EDITORIAL DIRECTOR',
      location: 'Berlin, DE',
      email: 'example@gmail.com',
      phone: '+44 123 456 7890',
      img: 'https://i.pravatar.cc/150?u=elena',
    },
    {
      name: 'Marcus Wu',
      role: 'DIGITAL STRATEGIST',
      location: 'San Francisco, US',
      email: 'example@gmail.com',
      phone: '+44 123 456 7890',
      img: 'https://i.pravatar.cc/150?u=marcus',
    },
    {
      name: 'Sanae Itoh',
      role: 'VISUAL CURATOR',
      location: 'Tokyo, JP',
      email: 'example@gmail.com',
      phone: '+44 123 456 7890',
      img: 'https://i.pravatar.cc/150?u=sanae',
    },
  ];
}
