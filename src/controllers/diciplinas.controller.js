//fazer a controller
const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

const DisciplinasController = {
    async buscar(req, res) {
        const disciplinas = await knex('disciplinas').select('*');
        return res.json(disciplinas);
    },
    async buscarBy(req, res) {
        const {id} = req.body;
        const disciplina = await knex('disciplinas').where('id_disciplina', id);
        return res.json(disciplina);
    },

    async inserirdisciplina(req, res) {
        const {disciplina} = req.body;
        let result = await knex('disciplinas').insert(disciplina);

        if(!result) return res.status(400).json({msg:'user does not inserted'});

        return res.status(200).json({msg:'user inserted'});
    },

    async updatedisciplina(req, res) {
        const {disciplina} = req.body;

        let result = await knex('disciplinas').where({ id_disciplina: disciplina.id_disciplina }).update(disciplina)
        if(!result) return res.status(400).json({msg:'user does not updated'});

        return res.status(200).json({msg:'user updated'});
    },

    async deletardisciplina(req, res) {
        const {id} = req.body;
        const disciplina = await  knex('disciplinas').where('id_disciplina', id).del()

        if(!disciplina) return res.status(400).json({msg:'user does not exist'});

        return res.status(200).json({msg:'user deleted'});
    }
}

module.exports = DisciplinasController;