// Importando os módulos necessários
const express = require("express"); // Framework para criar o servidor
const mongoose = require("mongoose"); // Biblioteca para interagir com o MongoDB
const bodyParser = require("body-parser"); // Middleware para processar JSON
require("dotenv").config(); // Carregar variáveis de ambiente do arquivo .env

// Criando a aplicação Express
const app = express();

// Middleware para processar JSON no corpo das requisições
app.use(bodyParser.json());

// Conexão com o MongoDB usando o Mongoose
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado!")) // Mensagem de sucesso
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err)); // Mensagem de erro

// Definição do modelo de estudante
const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "O nome é obrigatório."] // Validação para campo obrigatório
  },
  courseName: { 
    type: String, 
    required: [true, "O nome do curso é obrigatório."] // Validação para campo obrigatório
  },
  email: { 
    type: String, 
    default: null // Valor padrão se não for fornecido
  },
  number: { 
    type: String, 
    required: [true, "O número é obrigatório."] // Validação para campo obrigatório
  },
  grade: { 
    type: String, 
    default: "F" // Valor padrão se não for fornecido
  }
});

// Criando o modelo com base no esquema
const Student = mongoose.model("Student", studentSchema);

// Rota para criar um estudante
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body); // Cria um novo estudante com os dados da requisição
    await student.save(); // Salva o estudante no banco de dados
    res.status(201).json({ message: "Estudante criado com sucesso!", student }); // Resposta de sucesso
  } catch (error) {
    res.status(400).json({ error: error.message }); // Resposta de erro
  }
});

// Rota para listar todos os estudantes
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find(); // Busca todos os estudantes no banco de dados
    res.status(200).json(students); // Resposta com a lista de estudantes
  } catch (error) {
    res.status(500).json({ error: error.message }); // Resposta de erro
  }
});

// Rota inicial para testar a API
app.get("/", (req, res) => {
  res.send({ message: "API funcionando!" }); // Mensagem simples para verificar se o servidor está rodando
});

// Configuração da porta e inicialização do servidor
const PORT = process.env.PORT || 3000; // Define a porta a partir do .env ou usa 3000 como padrão
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Mensagem indicando que o servidor está ativo

// Encontrar estudante pelo e-mail
app.get("/api/students/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const student = await Student.findOne({ email }); // Busca o estudante pelo e-mail
  
      if (!student) {
        return res.status(404).json({ message: "Estudante não encontrado!" });
      }
  
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Atualizar nota (grade) pelo e-mail
  app.put("/api/students/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const { grade } = req.body;
  
      // Verifica se o estudante existe
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(404).json({ message: "Estudante não encontrado!" });
      }
  
      // Atualiza a nota
      student.grade = grade || "F";
      await student.save();
  
      res.status(200).json({ message: "Nota atualizada com sucesso!", student });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  