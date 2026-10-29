import credits from './stock-credits.json'

export const me = {
  name: 'Abdallah Alreba',
  handle: 'Jo Engineer',
  role: 'Mechatronics & robotics engineer',
  tagline: 'I build robots, break them on purpose, and keep the notes.',
  about: 'Mechatronics & robotics engineer who loves R&D. Mechanics, boards, firmware and perception, all in one head and one workshop.',
  email: 'engfordx27@gmail.com',
  // Placeholder links: replace with your own. Leave a value empty ('') to hide that link.
  social: {
    github: 'https://github.com/your-name',
    linkedin: 'https://www.linkedin.com/in/your-name',
    youtube: 'https://www.youtube.com/@your-channel',
  },
  now: ['Balancing the gripper linkage', 'Re-routing the motor board (Rev C)', 'Teaching the rover about glass doors'],
}

export const categories = [
  { id: 'robotics', label: 'Robotics', blurb: 'Arms, mobile robots and mechanisms' },
  { id: 'embedded', label: 'Embedded & electronics', blurb: 'Boards, firmware and the wiring behind them' },
  { id: 'software-ai', label: 'Software & AI', blurb: 'Mapping, perception and autonomy' },
  { id: 'cad', label: 'CAD & fabrication', blurb: 'Designed on screen, made on the bench' },
] as const
export type CategoryId = (typeof categories)[number]['id']

// Projects live in content/projects/<slug>/index.mdx (see lib/projects.ts).

export const skills: Record<string, string[]> = {
  Robotics: ['Kinematics', 'Motion planning', 'ROS 2', 'Control (PID, MPC)'],
  Embedded: ['STM32', 'ESP32', 'PCB design', 'RTOS'],
  'Software / AI': ['C++', 'Python', 'SLAM', 'Computer vision'],
  CAD: ['SolidWorks', 'Fusion 360', 'FEA', 'DFM for printing and CNC'],
}

export type Credit = { slug: string; category: CategoryId; title: string; author: string; license: string; source: string }
export const stockCredits = credits as Credit[]
