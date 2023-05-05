/**
 * Pelo menos um campo obrigatório
 */
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export { AtLeast };
