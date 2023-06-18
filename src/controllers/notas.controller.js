const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

const NotasController = {

    async buscar(req, res) {
        const notas = await knex('notas').select('*');
        return res.json(notas);
    },

    async buscarPorAluno(req, res) {
        const {id} = req.body;
        const notas = await knex('notas').where('id_aluno', id);
        return res.json(notas);
    },

    async buscarPorTurma(req, res) {
        const {id} = req.body;
        let alunos = await knex('alunos').where('id_turma', id);

        for(let i = 0;alunos.length > i; i++) {
            alunos[i].notas = await knex('notas').where('id_aluno', alunos[i].aluno.id);
        }

        return res.json(alunos);
    },



    async inserirNotas(req, res) {
        const {nota} = req.body;
        let result = await knex('notas').insert(nota);

        if(!result) return res.status(400).json({msg:'user does not inserted'});

        return res.status(200).json({msg:'user inserted'});

    },
    async updateNotas(req, res) {
        const {nota} = req.body;

        let result = await knex('notas').where({
                id_aluno: nota.id_notas,
                id_disciplina: nota.id_disciplina,
                periodo: nota.periodo
            }).update(nota)

        if(!result) return res.status(400).json({msg:'user does not updated'});

        return res.status(200).json({msg:'user updated'});

    },
    async deletarNotas(req, res) {
        const {nota} = req.body;
        const notas = await  knex('notas').where({
            id_aluno: nota.id_notas,
            id_disciplina: nota.id_disciplina,
            periodo: nota.periodo
        }).del()

        if(!notas) return res.status(400).json({msg:'user does not exist'});

        return res.status(200).json({msg:'user deleted'});
    }
}

module.exports = NotasController;