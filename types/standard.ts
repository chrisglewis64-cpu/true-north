/**
 * A single principle from My Standard (The Code).
 * Identity is the foundation of every action in True North.
 */
export interface Standard {
  id: string;
  order: number;
  statement: string;
}

/**
 * The user's complete set of standards — displayed on Landing and reviewed in Debrief.
 */
export interface StandardSet {
  principles: Standard[];
}
