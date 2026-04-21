# Easypet Ecosystem - Master Project Document

## 1. Visão Geral do Projeto
O **Easypet** é uma plataforma multimodular e multi-tenancy (Múltiplas Lojas/Empresas) voltada para o mercado pet. O objetivo é servir como um "Marketplace/SuperApp" onde tutores de pets podem:
- Comprar produtos (Rações, Acessórios).
- Agendar serviços de banho e tosa (Grooming).
- Agendar consultas veterinárias (Vet).

Paralelamente, o sistema fornece um painel administrativo para as **Empresas parceiras**, que podem ativar módulos específicos de acordo com seu ramo de atuação (ex: um veterinário independente assina apenas o módulo VET).

---

## 2. Arquitetura do Sistema (Microserviços)

O sistema foi desenhado de forma moderna e escalável, utilizando o padrão arquitetural de Microserviços baseados em **Java / Spring Boot 3+** no Backend e **Angular 17+** no Frontend.

### 2.1 Componentes Principais

#### API Gateway (`easypet-gateway`)
- **Porta:** 8080
- **Papel:** Porta de entrada única para todas as requisições (BFF - Backend For Frontend). Realiza o roteamento de URLs e a validação básica de tokens de segurança.

#### Módulo de Autenticação (`auth-service`)
- **Porta:** 8081
- **Papel:** Gerenciar o cadastro de usuários e lojistas.
- **Tecnologia Chave:** Spring Security, JWT (JSON Web Tokens). Ele é responsável por emitir os tokens. Outros microserviços farão apenas a validação da assinatura do token.

#### Módulo de Empresas (`business-service`)
- **Porta:** 8082
- **Papel:** Cadastro de "Lojas/Clínicas" no Marketplace.
- **Tecnologia Chave:** Relacionamento da Empresa com "Módulos Ativos" (ECOMMERCE, VET, GROOMING). Ele expõe o catálogo de lojas como faz o iFood.

#### Módulo de Catálogo/E-commerce (`catalog-service`)
- **Porta:** 8083
- **Papel:** Manter a persistência de Produtos e Categorias. Obrigatório que cada produto faça referência a um `businessId` do `business-service`.

#### Módulo de Agendamentos (`appointment-service`) - *Fase Futura*
- **Porta:** 8084
- **Papel:** Controle de agenda de veterinários e banho/tosa.

#### Módulo de Perfil e Pets (`profile-service` ou associado ao Auth) - *Fase Futura*
- **Porta:** 8085
- **Papel:** Cadastro avançado do Tutor (múltiplos endereços de entrega de produtos) e gestão centralizada dos Pets (perfis, cadernetas de vacinação e prontuários médicos).

---

## 3. Padrões de Domínio (Entidades Principais)

### Serviço de Negócios (Business Service)
- **`Business`**: ID, Name, OwnerEmail (Chave de ligação com Auth), Description, LogoUrl, Active (Boolean).
- **`ModuleType`** (Enum): ECOMMERCE, VET, GROOMING.

### Serviço de Catálogo (Catalog Service)
- **`Category`**: ID, Name, Description, Active (Boolean).
- **`Product`**: ID, Name, Description, Price, StockQuantity, BusinessId (UUID String - FK lógica), CategoryId (UUID String - FK lógica).

### Serviço de Perfil e Pets (Fase Futura)
- **`UserAddress`**: ID, UserId (FK), Street, City, ZipCode, IsDefault (Delivery).
- **`Pet`**: ID, OwnerId (FK), Name, Species, Breed, BirthDate.
- **`MedicalRecord` / `VaccineCard`**: Prontuários e vacinas associados ao Pet e possivelmente assinados pela Clínica (`BusinessId`).

---

## 4. Comunicação Inter-serviços
- **Comunicação Síncrona:** A comunicação imediata (ex: o Catalog Service confirmar se um BusinessId existe antes de criar um produto) será feita via **OpenFeign** (Client HTTP).
- **Comunicação Assíncrona (Avançado):** Mensageria com RabbitMQ/Kafka será deixada para eventos futuros, como notificações pós-venda.

---

## 5. UI/UX - Guias do Frontend

O Frontend é baseado em **Angular 17+** utilizando abordagem *Standalone Components* e a *Control Flow Syntax (@if, @for)*.

- **Folhas de Estilo:** **Tailwind CSS v3.4** "CSS-Only", com o plugin de componentes UI **DaisyUI v4**.
- **Jornada do Usuário (Marketplace):** 
  - Tela 1: Lista de Lojas (Categorizadas por tags: Produtos, Saúde, Estética).
  - Tela 2: Ao clicar na loja, abre o Catálogo específico dela.
- **Jornada do Lojista (Painel):**
  - Módulos administrativos para cadastrar a loja, selecionar serviços e gerenciar estoque através de uma interface de Tabelas CRUD Modal.

---

## 6. Infraestrutura de Dev

- Criação através de multi-módulos Maven/Gradle ou pastas isoladas como Monorepo.
- Cada Microserviço possuirá sua base de dados isolada logicamente (ex: Schemas diferentes no PostgreSQL) para obedecer à regra de ouro dos Microserviços (Loose Coupling).
- Migrações controladas estritamente via **Flyway**.
