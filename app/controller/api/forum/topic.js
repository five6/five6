'use strict';

const Controller = require('egg').Controller;

module.exports = () => {
  class TopicController extends Controller {
    async create(ctx) {
      const rule = {
        title: { required: true, type: 'string' },
        content: { required: true, type: 'string' },
      };
      const errors = this.ctx.validate(rule, this.ctx.request.body);
      if (errors) {
        this.ctx.body = { code: -1, message: '标题和内容必须' };
      } else {
        const result = await ctx.service.topic.create();
        ctx.body = {
          code: 0,
          data: result,
        };
      }
    }
    async delete(ctx) {
      ctx.body = {
        code: 0,
        data: [],
      };
    }
    async list(ctx) {
      const result = await ctx.service.topic.list();
      ctx.body = {
        code: 0,
        data: result,
      };
    }
    async edit(ctx) {
      ctx.body = {
        code: 0,
        data: [],
      };
    }
    async reply(ctx) {
      ctx.body = {
        code: 0,
        data: [],
      };
    }
  }
  return TopicController;
};