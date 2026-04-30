export const ICT_LEVELS = ['ND1', 'ND2', 'HND1', 'HND2'];

export const ICT_DEPARTMENT_GROUPS = {
  nd: {
    label: 'ND Foundation',
    levels: ['ND1', 'ND2'],
    departments: ['Computer Science']
  },
  hnd: {
    label: 'HND Specializations',
    levels: ['HND1', 'HND2'],
    departments: [
      'Software and Web Development',
      'Artificial Intelligence',
      'Networking and Cloud Computing',
      'Cyber Security'
    ]
  }
};

export const ICT_DEPARTMENT_CARDS = [
  {
    name: 'Computer Science',
    code: 'CS',
    levels: ['ND1', 'ND2'],
    description: 'Foundation courses for ND1 and ND2 Computer Science students.'
  },
  {
    name: 'Software and Web Development',
    code: 'SWD',
    levels: ['HND1', 'HND2'],
    description: 'HND specialization for software engineering and modern web systems.'
  },
  {
    name: 'Artificial Intelligence',
    code: 'AI',
    levels: ['HND1', 'HND2'],
    description: 'HND specialization for machine learning, automation, and intelligent systems.'
  },
  {
    name: 'Networking and Cloud Computing',
    code: 'NCC',
    levels: ['HND1', 'HND2'],
    description: 'HND specialization for networks, cloud infrastructure, and distributed systems.'
  },
  {
    name: 'Cyber Security',
    code: 'CYS',
    levels: ['HND1', 'HND2'],
    description: 'HND specialization for security, risk, defense, and digital protection.'
  }
];

const HND_DEPARTMENT_ALIASES = [
  ['software and web development', 'software development', 'web development'],
  ['artificial intelligence', 'ai'],
  ['networking and cloud computing', 'networking', 'cloud computing'],
  ['cyber security', 'cybersecurity']
];

export const normalizeName = (value = '') => value.trim().toLowerCase();

export const isSchoolOfIct = (faculty) => normalizeName(faculty?.name) === 'school of ict';

export const hasSchoolOfIct = (faculties = []) => faculties.some(isSchoolOfIct);

export const isPlainIct = (faculty) => normalizeName(faculty?.name) === 'ict';

export const visibleFaculties = (faculties = []) => {
  if (!hasSchoolOfIct(faculties)) return faculties;
  return faculties.filter(faculty => !isPlainIct(faculty));
};

export const findSchoolOfIct = (faculties = []) => {
  return faculties.find(isSchoolOfIct)
    || faculties.find(faculty => normalizeName(faculty?.name).includes('ict'));
};

export const isIctLevel = (level) => ICT_LEVELS.includes(level);

export const isNdLevel = (level) => ICT_DEPARTMENT_GROUPS.nd.levels.includes(level);

export const isHndLevel = (level) => ICT_DEPARTMENT_GROUPS.hnd.levels.includes(level);

export const getIctLevelGroup = (level) => {
  if (isNdLevel(level)) return ICT_DEPARTMENT_GROUPS.nd;
  if (isHndLevel(level)) return ICT_DEPARTMENT_GROUPS.hnd;
  return null;
};

export const isDepartmentAllowedForIctLevel = (department, level) => {
  const name = normalizeName(department?.name);
  if (!name || !isIctLevel(level)) return true;

  if (isNdLevel(level)) {
    return name === 'computer science';
  }

  return HND_DEPARTMENT_ALIASES.some(aliases => aliases.some(alias => name.includes(alias)));
};

export const filterDepartmentsForIctLevel = (departments = [], level) => {
  if (!isIctLevel(level)) return departments;
  return departments.filter(department => isDepartmentAllowedForIctLevel(department, level));
};

export const getIctLevelHint = (level) => {
  const group = getIctLevelGroup(level);
  if (!group) return '';
  return `${group.levels.join('/')} uses ${group.departments.join(', ')}`;
};

export const getIctDepartmentCard = (department) => {
  const name = normalizeName(department?.name);
  return ICT_DEPARTMENT_CARDS.find(card => normalizeName(card.name) === name) || null;
};

export const getIctDepartmentLevels = (department) => {
  return getIctDepartmentCard(department)?.levels || [];
};

export const sortIctDepartments = (departments = []) => {
  return [...departments].sort((a, b) => {
    const aIndex = ICT_DEPARTMENT_CARDS.findIndex(card => normalizeName(card.name) === normalizeName(a.name));
    const bIndex = ICT_DEPARTMENT_CARDS.findIndex(card => normalizeName(card.name) === normalizeName(b.name));

    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};
