//fazer a controller
const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

const TurmaController = {

    async buscar(req, res) {
        const turmas = await knex('turmas').select('*');
        return res.json(turmas);
    },

    async buscarBy(req, res) {
        const {id} = req.body;
        const turmas = await knex('turmas').where('id_turmas', id);
        return res.json(turmas);
    },

    async inserirTurmas(req, res) {
        const {turma} = req.body;
        let result = await knex('turmas').insert(turma);

        if(!result) return res.status(400).json({msg:'turma does not inserted'});

        return res.status(200).json({msg:'turma inserted'});
    },

    async updateTurma(req, res) {
        const {turma} = req.body;
        let result = await knex('turmas').where({ id_turmas: turma.id_turmas }).update(turma)

        if(!result) return res.status(400).json({msg:'turma does not updated'});
        return res.status(200).json({msg:'turma updated'});
    },

    async deletarTurma(req, res) {
        const {id} = req.body;
        const turma = await  knex('turmas').where('id_turmas', id).del()

        if(!turma) return res.status(400).json({msg:'turma does not exist'});
        return res.status(200).json({msg:'turma deleted'});
    }

}

module.exports = TurmaController;