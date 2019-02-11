type IValidator = (propertyValue: any, propertyName: string, entity: any, params: any) => string;

const validatorsRepository = new Map<string, IValidator>();
export default validatorsRepository;
