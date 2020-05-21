import { TAG, TEMPLATE, ASSET_TYPE } from '../config/constants';

import image1 from '../../media/images/project1.jpg';
import image2 from '../../media/images/project2.jpg';
import image3 from '../../media/images/project3.jpg';
import image4 from '../../media/images/project4.jpg';
import image5 from '../../media/images/project5.jpg';
import image6 from '../../media/images/project6.jpg';
import image7 from '../../media/images/project7.jpg';
import image8 from '../../media/images/project8.jpg';
import image9 from '../../media/images/project9.jpg';
import image10 from '../../media/images/project10.jpg';
import image11 from '../../media/images/project11.jpg';

import note1 from '../../notes/lorem_ipsum_test.md';

export const projects = [
  {
    id: 'noise-blob',
    image: image11,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Noise Blob II',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '20/05/2020',
    description:
      'This one was a combination of several different experiments. Including shadow maps, mouse picking and extending a PBR shader with reflections.',
    template: TEMPLATE.IFRAME,
    background: '#f2f2f2',
    data: {
      src: '/sketches/noise_blob',
    },
  },
  {
    id: 'lorem-ipsum-dolor',
    title: 'Lorem ipsum dolor sit amet, long title for a blog post',
    tags: [TAG.NOTE],
    published_at: '10/05/2020',
    template: TEMPLATE.NOTE,
    content: note1,
    thumbnail: {
      theme: 'dark five',
      background: '#8e8699',
    },
  },
  {
    id: 'triangular-mesh',
    image: image10,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Triangular Mesh',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '05/05/2020',
    description:
      'Triangular mesh with offset based noise. Bring up the debug panel with Shift + D',
    template: TEMPLATE.IFRAME,
    background: '#f2f2f2',
    data: {
      src: '/sketches/triangular_mesh',
    },
  },
  {
    id: 'wavy-noise-lines',
    image: image9,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Wavy Noise Lines',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '02/05/2020',
    description:
      'Wave-like lines created using Simplex 2D noise. Adjust the frequency and amplitude by moving your pointer or finger across the screen. Bring up the debug panel with Shift + D',
    template: TEMPLATE.IFRAME,
    background: '#f2f2f2',
    data: {
      src: '/sketches/wavy_noise_lines',
    },
  },
  {
    id: 'noise-attractor',
    image: image1,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Strange Noise Attractor',
    tags: [TAG.SKETCH, TAG.GENERATIVE],
    published_at: '11/10/2019',
    description:
      'Strange attractors mixed with some simplex noise. Click to generate a new one. Hit Shift + D to bring up the debug panel.',
    template: TEMPLATE.IFRAME,
    background: '#0d0d0d',
    data: {
      src: '/sketches/noise_attractor',
    },
  },
  {
    id: 'magnetic-noise-fields',
    image: image2,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Magnetic Noise Fields',
    tags: [TAG.SKETCH, TAG.GENERATIVE],
    published_at: '15/12/2019',
    template: TEMPLATE.IFRAME,
    description:
      '2D noise applied to particles forming some kind of interesting magnetic field pattern. Hit Shift + D to bring up the debug panel',
    background: '#383d59',
    data: {
      src: '/sketches/magnetic_noise_fields',
    },
  },
  {
    id: 'fibonacci-circle-springs',
    image: image3,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Fibonacci Circle Springs',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '20/12/2019',
    template: TEMPLATE.IFRAME,
    description:
      'Using the golden ratio to create a flower-like pattern, plus some spring physics. Hit Shift + D to bring up the debug panel.',
    background: '#f2f2f2',
    data: {
      src: '/sketches/fibonacci_circle_springs',
    },
  },
  {
    id: 'interactive-noise-springs',
    image: image4,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Interactive Noise Circle',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '05/01/2020',
    template: TEMPLATE.IFRAME,
    description:
      'Using simple 2D noise to animate the circles, combined with spring physics. Hit Shift + D to bring up the debug panel.',
    background: '#150030',
    data: {
      src: '/sketches/interactive_noise_springs',
    },
  },
  {
    id: 'rotating-lines',
    image: image5,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Rotating Lines',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '05/07/2018',
    template: TEMPLATE.IFRAME,
    description:
      'Lines pointing at where your mouse moves. Almost a little furry.',
    background: '#ffc0cb',
    data: {
      src: '/sketches/rotating_lines',
    },
  },
  {
    id: 'moving-noise-lines',
    image: image6,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Moving Noise Lines',
    tags: [TAG.SKETCH],
    published_at: '30/07/2019',
    template: TEMPLATE.IFRAME,
    description:
      'This one happened entirely by accident. I just left it as this. The random movement is kinda interesting to look at.',
    background: '#d4dbf5',
    data: {
      src: '/sketches/noise_lines',
    },
  },
  {
    id: 'elastic-blob',
    image: image7,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Elastic Blob',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '20/06/2018',
    template: TEMPLATE.IFRAME,
    description:
      'A kinda creepy looking blob animated with some noise. Looks like something tries to get out of it.',
    background: '#120d1e',
    data: {
      src: '/sketches/elastic_blob',
    },
  },
  {
    id: 'interactive-particles',
    image: image8,
    assetType: ASSET_TYPE.IMAGE,
    title: 'Interactive Particles',
    tags: [TAG.SKETCH, TAG.INTERACTIVE],
    published_at: '20/06/2018',
    template: TEMPLATE.IFRAME,
    description:
      "This was my first real attempt at creating an interactive particle cloud where the forces are purely calculated on GPU. Didn't turn out exactly as planned, but hey I still learned something.",
    background: '#20252f',
    data: {
      src: '/sketches/interactive_particles',
    },
  },
];

export const resume = {
  title: 'Lorem ipsum dolor sit amet',
  description: 'Lorem ipsum dolor sit amet. Dette er bare en test',
};

export const sayHi = {
  title: 'Lorem ipsum dolor sit amet',
  description: 'Lorem ipsum dolor sit amet. Dette er bare en test',
};

export const aboutMenu = [
  {
    id: 'resume',
    label: 'Resumé',
    href: '/resume',
  },
  {
    id: 'say-hi',
    label: 'Say hi',
    href: '/say-hi',
  },
];
