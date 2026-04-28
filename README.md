# 🐾 Easypet Ecosystem

![Easypet Cover](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Easypet+Microservices+Ecosystem) <!-- Substitua pela imagem real do seu dashboard/tela de login no futuro -->

> Um sistema moderno e robusto para o gerenciamento de pets, construído sob uma arquitetura de microserviços e um frontend focado em usabilidade e performance.

## 📖 Sobre o Projeto

O **Easypet** nasceu como um sistema para unificar o controle e o gerenciamento de pets e prontuários. Para garantir alta escalabilidade, manutenibilidade e resiliência, a aplicação foi desenhada em uma arquitetura de **Microserviços** no backend, conectada a um Frontend reativo de última geração.

Esse projeto serve como um MVP (Minimum Viable Product) funcional, incluindo autenticação segura e operações completas (CRUD) de pets, além de atuar como peça fundamental no meu portfólio de Engenharia de Software.

---

## 🚀 Tecnologias Utilizadas

### 🎨 Frontend
- **Angular 21** (Arquitetura Standalone & Signals)
- **Tailwind CSS 3** (Estilização utilitária)
- **DaisyUI 4.x** (Biblioteca de componentes visuais UI)
- Integração com **Google OAuth2** (Login Social)

### ⚙️ Backend (Microserviços)
- **Java 21+ & Spring Boot 3** (Framework Base)
- **Spring Cloud Gateway** (`easypet-gateway`)
- **Spring Security & JWT** (`auth-service`)
- **Spring Data JPA** (`business-service` e catálogos)
- Arquitetura baseada em **Record Types** e **DTOs**

### 🗄️ Infraestrutura & Bancos de Dados
- **PostgreSQL** (Bancos isolados por domínio: `auth_db` e `business_db`)
- **Docker & Docker Compose** (Orquestração de containers)
- **pgAdmin** (Gerenciamento visual do banco de dados)

---

## 🧩 Arquitetura do Sistema

O backend foi dividido para garantir que cada domínio seja escalável de forma independente:

1. **API Gateway (`easypet-gateway`)**: Ponto de entrada único da aplicação. Roteia as requisições para os serviços correspondentes.
2. **Auth Service (`auth-service`)**: Responsável por todo o fluxo de autenticação, registro, esqueci minha senha, emissão e validação de tokens JWT, além do Login Social via Google.
3. **Business Service (`business-service`)**: Lida com a lógica de negócio principal. Atualmente gerencia toda a entidade de **Pets** (Cadastro, Edição, Deleção e Listagem paginada).

---

## 🌟 Funcionalidades (Features)

- [x] **Autenticação Completa:** Login, Registro e Redefinição de Senha.
- [x] **Login Social:** Integração nativa e transparente com Google Auth.
- [x] **Proteção de Rotas:** Frontend protegido via Guards funcionais (Angular) e interceptors de Token JWT.
- [x] **Pet Management (CRUD):** 
  - Listagem em grid com paginação.
  - Adição e Edição via Modais reativos e responsivos.
  - Deleção com estratégia de exclusão segura.
- [x] **Interface Premium:** Design elegante utilizando padrões modernos (sombras sutis, bordas arredondadas e interações responsivas).

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (v18+)
- **Angular CLI** (v17+)
- **Java JDK** (v21)
- **Docker** e **Docker Compose**
- **Maven** ou **Gradle**

### 1. Subindo a Infraestrutura de Dados
No diretório raiz do projeto, inicie os bancos de dados (PostgreSQL) usando o Docker:
```bash
docker-compose up -d
```
*Isso criará instâncias separadas para o banco de autenticação (`auth-db`), negócios (`business-db`) e o `pgadmin` na porta `5050`.*

### 2. Rodando o Backend
Inicie cada microserviço separadamente através de sua IDE favorita (IntelliJ, Eclipse, VSCode) ou via terminal. A ordem recomendada é:
1. `auth-service`
2. `business-service`
3. `easypet-gateway`

### 3. Rodando o Frontend
Navegue até a pasta `frontend`, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd frontend
npm install
npm run start
```
O frontend estará acessível em `http://localhost:4200`.

---

## 🤝 Contribuição e Workflow

Este projeto utiliza a metodologia **Gitflow**. Novas features são desenvolvidas em branches `feat/*`, validadas e mescladas na `develop`. A branch `main` mantém o código em estado constante de produção (MVP).

---
> Desenvolvido com dedicação por Randy Gomes 🚀
