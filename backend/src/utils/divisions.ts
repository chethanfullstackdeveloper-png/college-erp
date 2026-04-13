// Division structure for the college ERP
export const DIVISIONS = {
  '1PUC': {
    Science: {
      PCMB: 'Physics, Chemistry, Maths, Biology',
      PCMC: 'Physics, Chemistry, Maths, Computer Science',
    },
    Commerce: {
      ERAC: 'Economics, Accountancy, Commerce, English',
    },
  },
  '2PUC': {
    Science: {
      PCMB: 'Physics, Chemistry, Maths, Biology',
      PCMC: 'Physics, Chemistry, Maths, Computer Science',
    },
    Commerce: {
      ERAC: 'Economics, Accountancy, Commerce, English',
    },
  },
};

export const getDivisionHierarchy = () => {
  return Object.keys(DIVISIONS);
};

export const getStreamsForYear = (year: string): string[] => {
  return Object.keys(DIVISIONS[year as keyof typeof DIVISIONS] || {});
};

export const getBranchesForStream = (year: string, stream: string): string[] => {
  const streams = DIVISIONS[year as keyof typeof DIVISIONS];
  if (!streams) return [];
  return Object.keys(streams[stream as keyof typeof streams] || {});
};

export const isValidDivision = (year: string, stream: string, branch: string): boolean => {
  const branches = getBranchesForStream(year, stream);
  return branches.includes(branch);
};
