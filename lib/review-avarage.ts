export const getReviewAvarage = (reviews: number[]) => {
  if (reviews.length === 0) return 0;
  return reviews.reduce((acc, review) => acc + review, 0) / reviews.length;
};
