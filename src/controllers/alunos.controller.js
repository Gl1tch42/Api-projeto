//fazer a controller
const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

// mysql://MichelEnzo:1234@localhost:3306/trabalho_s'

const AlunoController = {
    async buscar(req, res) {
        let alunos = await knex('alunos').select('*');
        for (let index = 0; index < alunos.length; index++) {
            const e = alunos[index];
            const turma = await knex('turmas').where('id_turmas', e.id_turmas);
            alunos[index].turma = turma[0].nm_turma;
        }
        return res.json(alunos);
    },

    async buscarBy(req, res) {
        const {id} = req.body;
        const alunos = await knex('alunos').where('id_aluno', id);
        return res.json(alunos);
    },

    async buscarPorTurma(req, res) {
        const {id} = req.body;
        const alunos = await knex('alunos').where('id_aluno', id);
        return res.json(alunos);
    },

    async inserirAluno(req, res) {
        const {aluno} = req.body;
        let result = await knex('alunos').insert(aluno);

        if(!result) return res.status(400).json({msg:'user does not inserted'});

        return res.status(200).json({msg:'user inserted'});

    },

    async updateAluno(req, res) {
        const {aluno} = req.body;

        let result = await knex('alunos').where({ id_aluno: aluno.id_aluno }).update(aluno)

        if(!result) return res.status(400).json({msg:'user does not updated'});

        return res.status(200).json({msg:'user updated'});

    },

    async deletarAluno(req, res) {
        const {id} = req.body;
        const aluno = await  knex('alunos').where('id_aluno', id).del()

        if(!aluno) return res.status(400).json({msg:'user does not exist'});

        return res.status(200).json({msg:'user deleted'});

    },

    // casos de uso

    async getBoletim(req, res) {
        const { id } = req.body;

        const alunos = await knex('alunos').where('id_aluno', id);
        const disciplinas = await knex('disciplinas').select('*');

        let boletim = {
            aluno: alunos[0].nm_aluno
        }

        let disciplinasSalvas = [];

        console.log(disciplinas)

        for (let i = 0; i < disciplinas.length; i++) {
            const e = disciplinas[i];

            const n = await knex('notas')
                    .select('periodo', 'nota')
                    .where('id_disciplina', '=', e.id_disciplina )
                    .andWhere('id_aluno', '=', id);
            
            let diciplina = {
                nome: e.nm_disciplina,
                bimestre1: n.filter(x => x.periodo == "primeiroBimestre").length > 0 ? n.filter(x => x.periodo == "primeiroBimestre")[0].nota : null,
                bimestre2: n.filter(x => x.periodo == "segundoBimestre").length > 0 ? n.filter(x => x.periodo == "segundoBimestre")[0].nota : null,
                bimestre3: n.filter(x => x.periodo == "terceiroBimestre").length > 0 ? n.filter(x => x.periodo == "terceiroBimestre")[0].nota : null,
                bimestre4: n.filter(x => x.periodo == "quartoBimestre").length > 0 ? n.filter(x => x.periodo == "quartoBimestre")[0].nota : null,
                recuperacao: n.filter(x => x.periodo == "recuperacao").length > 0 ? n.filter(x => x.periodo == "recuperacao")[0].nota : null
            }
            console.log(diciplina)
            disciplinasSalvas.push(diciplina);
        }

        boletim.disciplinas = disciplinasSalvas;

        return res.status(200).json(boletim);
    },

    async getAulasAluno(req, res) {
        const { idAluno } = req.body;
        const aluno = await knex('alunos').where('id_aluno', idAluno);

        const aulas = await knex('aula').where('id_turmas', aluno[0].id_turmas);

        let aulasAjustadas = [];

        for (let i = 0; i < aulas.length; i++) {
            let e = aulas[i];
            let diaSemana = "";

            if(e.horario.includes('seg')){
                diaSemana = 'Segunda';
            } else if(e.horario.includes('ter')) {
                diaSemana = 'Terça';
            } else if(e.horario.includes('qua')) {
                diaSemana = 'Quarta';
            } else if(e.horario.includes('qui')) {
                diaSemana = 'Quinta';
            } else if(e.horario.includes('sex')) {
                diaSemana = 'Sexta';
            }

            let turma = await knex('turmas')
            .select('nm_turma as nome')
            .where('id_turmas', '=', e.id_turmas)


            const professor = await knex('professor').where('id_professor', e.id_professor);
            const disciplina = await knex('disciplinas').where('id_disciplina', professor[0].id_disciplina);

            let aula = {
                dia: diaSemana,
                disciplina: disciplina[0].nm_disciplina,
                turma: turma[0].nome,
                hora: e.horario.substring(4)
            }
            aulasAjustadas.push(aula);
        }
        return res.status(200).json(aulasAjustadas);
    }
}

module.exports = AlunoController;