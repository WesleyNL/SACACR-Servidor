/**
 * Acesso.js
 *
 */

module.exports = {

  attributes: {

    codigo:{
      type: 'integer',
      required: true,
      unique: true,
    },

    nome:{
      type: 'string',
      required: true,
      size: 100,
    },

    login:{
      type: 'string',
      required: true,
      unique: true,
      size: 20,
    },

    senha:{
      type: 'string',
      required: true,
      size: 20,
    },

    data_inclusao:{
      type: 'datetime',
      required: true,
    },

   //data_acesso:{
      //type: 'datetime',
      //required: true,
    //},
  }
};