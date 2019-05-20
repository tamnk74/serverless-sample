export default class BaseBusiness {
 
  constructor(model) {
    this.model = model;
  }
 
  async findAll(options = {}) {
    options.limit = options.limit ? parseInt(options.limit) : 12;
    if (options.page) {
      options.page = parseInt(options.page);
      options.offset = ((options.page - 1) * options.limit);
      delete options.page;
    }
 
    return await this.model.findAll(options);
  }
 
  async findOne(options) {
    return await this.model.findOne(options);
  }
 
  async findByPk(id) {
    return await this.model.findByPk(id);
  }
 
  async create(data) {
    return await this.model.create(data);
  }
 
  async update(data, options) {
    return await this.model.update(data, options);
  }
 
  async destroy(options) {
    return await this.model.destroy(options);
  }
 
  async findAndCountAll(options = {}) {
    return await this.model.findAndCountAll(options)
  }
}