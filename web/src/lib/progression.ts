export const getProgressFromStatus = (status: string): number => {
  switch (status) {
    case 'à venir':
      return 0;
    case 'en cours':
      return 50;
    case 'terminé':
      return 100;
    default:
      return 0;
  }
};