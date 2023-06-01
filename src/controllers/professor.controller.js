const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://root:1234@localhost:3306/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    }
});




const ProfessorController = {

    async buscar(req, res) {
        const professor = await knex('professor').select('*');
        return res.json(professor);
    },

    async buscarBy(req, res) {
        const { id } = req.body;
        const professor = await knex('professor').where('id_professor', id);
        return res.json(professor);
    },

    async buscarPorDisciplina(req, res) {
        const { id } = req.body;
        const professor = await knex('professor').where('id_disciplina', id);
        return res.json(professor);
    },

    async inserirProfessor(req, res) {
        const { professor } = req.body;
        let result = await knex('professor').insert(professor);

        if (!result) return res.status(400).json({ msg: 'user does not inserted' });

        return res.status(200).json({ msg: 'user inserted' });

    },
    async updateProfessor(req, res) {
        const { professor } = req.body;

        let result = await knex('professor').where({ id_professor: professor.id_professor }).update(professor)

        if (!result) return res.status(400).json({ msg: 'user does not updated' });

        return res.status(200).json({ msg: 'user updated' });

    },
    async deletarProfessor(req, res) {
        const { id } = req.body;
        const professor = await knex('professor').where('id_professor', id).del()

        if (!professor) return res.status(400).json({ msg: 'user does not exist' });

        return res.status(200).json({ msg: 'user deleted' });
    },


    //caso de uso
    async buscarTumasDaAula(req, res) {
        const { idProfessor, idDiciplina } = req.body;

        console.log(idDiciplina)

        let turmas = await knex('turmas as t')
            .leftJoin('aula as a', 'a.id_turmas', '=', 't.id_turmas')
            .select('nm_turma as nome', 't.id_turmas as id')
            .where('a.id_professor', '=', idProfessor)
            .distinct();
        let turmaProcess = []
        for (let index = 0; index < turmas.length; index++) {
            const e = turmas[index];
            
            let alunos = await knex('alunos as A')
                .select('nm_aluno as nome', 'id_aluno as matricula')
                .where('A.id_turmas', '=', turmas[index].id);

            let todosAlunos = [];
            for (let y = 0; y < alunos.length; y++) {
                let u = alunos[y];
                
                const n = await knex('notas')
                    .select('periodo', 'nota')
                    .where('id_disciplina', '=', idDiciplina)
                    .andWhere('id_aluno', '=', u.matricula);
                
                let nota = {
                    primeiroBimestre: n.filter(x => x.periodo == "primeiroBimestre").length > 0 ? n.filter(x => x.periodo == "primeiroBimestre")[0].nota : 0,
                    segundoBimestre: n.filter(x => x.periodo == "segundoBimestre").length > 0 ? n.filter(x => x.periodo == "segundoBimestre")[0].nota : 0,
                    terceiroBimestre: n.filter(x => x.periodo == "terceiroBimestre").length > 0 ? n.filter(x => x.periodo == "terceiroBimestre")[0].nota : 0,
                    quartoBimestre: n.filter(x => x.periodo == "quartoBimestre").length > 0 ? n.filter(x => x.periodo == "quartoBimestre")[0].nota : 0,
                    recuperacao: n.filter(x => x.periodo == "recuperacao").length > 0 ? n.filter(x => x.periodo == "recuperacao")[0].nota : 0,
                }

                alunos[y].notas = nota;
                todosAlunos.push(alunos[y]);
            }
            e.alunos = todosAlunos;
            turmaProcess.push(e);
        }

        return res.status(200).json(turmaProcess);
    }
}


module.exports = ProfessorController;
