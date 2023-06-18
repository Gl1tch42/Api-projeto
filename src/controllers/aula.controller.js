//fazer a controller
const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

const aulaController = {

    async buscar(req, res) {
        let aulas = await knex('aula').select('*');
        for (let i = 0; i < aulas.length; i++) {
            const e = aulas[i];

            if(e.horario.includes('seg')){
                aulas[i].dia = 'Segunda';
            } else if(e.horario.includes('ter')) {
                aulas[i].dia = 'Terça';
            } else if(e.horario.includes('qua')) {
                aulas[i].dia = 'Quarta';
            } else if(e.horario.includes('qui')) {
                aulas[i].dia = 'Quinta';
            } else if(e.horario.includes('sex')) {
                aulas[i].dia = 'Sexta';
            }

            aulas[i].horario = e.horario.split(' ')[1];

            const professor = await knex('professor').where('id_professor', e.id_professor);
            aulas[i].nm_professor = professor[0].nm_professor;
            const turmas = await knex('turmas').where('id_turmas', e.id_turmas);
            aulas[i].nm_turma = turmas[0].nm_turma;
        }
        return res.json(aulas);
    },

    async buscarByTurmas(req, res) {
        const {id_turmas} = req.body;
        const aulas = await knex('aula').where({ id_turmas: id_turmas });
        return res.json(aulas);
    },
    
    async buscarByProfessor(req, res) {
        const {id_professor} = req.body;
        const aula = await knex('aula').where({ id_professor: id_professor });
        return res.json(aula);
    },

    async inserirAula(req, res) {

        const {aula} = req.body;

        const aulaSalva = await knex('aula').where({ id_professor: aula.id_professor, horario: aula.horario });
        const aulaSalva2 = await knex('aula').where({ id_turmas: aula.id_turmas, horario: aula.horario });
        if (aulaSalva.length > 0 || aulaSalva2.length > 0) {
            return res.status(400).json({msg:'professor ja tem esta aula'});
        }

        let result = await knex('aula').insert(aula);
        if(!result) return res.status(400).json({msg:'aula does not inserted'});
        return res.status(200).json({msg:'aula inserted'});
    },

    async updateAula(req, res) {
        const {aula} = req.body;
        let result = await knex('aula').where({ id_turmas: aula.id_turmas, id_professor: aula.id_professor }).update(aula)

        if(!result) return res.status(400).json({msg:'aula does not updated'});
        return res.status(200).json({msg:'aula updated'});
    },

    async deletarAula(req, res) {
        const {aula} = req.body;
        const del = await  knex('aula').where({ id_turmas: aula.id_turmas, id_professor: aula.id_professor, horario: aula.horario }).del()

        if(!del) return res.status(400).json({msg:'aula does not exist'});
        return res.status(200).json({msg:'aula deleted'});
    }

}

module.exports = aulaController;
