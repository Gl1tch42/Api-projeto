
const jwt = require('jsonwebtoken');
const knex = require('knex')({
    client: 'mysql2',
    connection: 'mysql://MichelEnzo:UVA@1234567@aoo.mysql.database.azure.com/trabalho_s',
    pool: {
        min: 2,
        max: 10,
    },
});

// const User = require('./../models/user');

const creatRefreshToken = (user) => {
    return jwt.sign(user, 'ew3452trwtg234t3vs@efw33%$#5',{
        expiresIn:'7d'
    })
}

const createAccessToken = (user) =>{
    return jwt.sign(user, 'ew3452trwtg234t3vs@efw33%$#5',{
      expiresIn: '11m'
    })
}


const authCtrl = {

    /**
     * login de usuario
     */
    loginAluno: async (req,res) => {
        try {
            const {matricula} = req.body;

            const aluno = await knex('alunos').where('id_aluno', matricula);
            let olnyAluno = aluno[0]

            if (!olnyAluno) return res.status(400).json({msg:'user does not exist'});

            const accessToken = createAccessToken({id: olnyAluno.id_aluno});
            const refreshToken = creatRefreshToken({id: olnyAluno.id_aluno});

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            });

            const turmas = await knex('turmas').where('id_turmas', olnyAluno.id_turmas);
            olnyAluno.turma = turmas[0].nm_turma;

            return res.json({accessToken, user: olnyAluno});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    loginProfessor: async (req,res) => {
        try {
            const {matricula} = req.body;
            const professor = await knex('professor').where('id_professor', matricula);

            let onlyProfessor = professor[0];
            if (!onlyProfessor) return res.status(400).json({msg:'user does not exist'});

            const accessToken = createAccessToken({id: onlyProfessor.id_professor});
            const refreshToken = creatRefreshToken({id: onlyProfessor.id_professor});

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            });


            const disciplina = await knex('disciplinas').where('id_disciplina', onlyProfessor.id_disciplina);
            onlyProfessor.disciplina = disciplina[0].nm_disciplina;

            return res.json({accessToken, user: onlyProfessor});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    loginSecretaria: async (req,res) => {
        try {
            const {matricula} = req.body;
            const secretaria =  await knex('secretaria').where('id_secretaria', matricula);

            let onlySecretaria = secretaria[0];
            if (!onlySecretaria) return res.status(400).json({msg:'user does not exist'});

            const accessToken = createAccessToken({id: onlySecretaria.id_secretaria});
            const refreshToken = creatRefreshToken({id: onlySecretaria.id_secretaria});

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path:'/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            });


            return res.json({accessToken, user: onlySecretaria});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },


    /**
     * controller logout
     */
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', {path:'/user/refresh_token'});
            return res.json({msg:'logged out'});

        } catch (err) {
            return res.status(500).json({msg:err.message});
        }
    },


    /**
     * refresh token
     */
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"});

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({msg: "Please Login or Register"});

                const accessToken = createAccessToken({id: user.id});

                res.json({user, accessToken});
            });

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },


}

module.exports = authCtrl;