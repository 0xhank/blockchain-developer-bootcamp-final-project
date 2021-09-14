# Consensys Blockchain Bootcamp Final Project

# Intro

I am still new to coding in blockchain, and I need to investigate coding paradigms that are optimized for the platform and ones that are a less viable. As it stands, I'm not sure about the feasibility of real-time card games. Would each user need to complete a transaction just to, say, play a card in go fish? Additionally, I need to spend more time investigating issues with Web2 for some of the ideas I've come up with. Stay tuned for more robust and fully thought-out ideas.
# Refresher: Pros and Cons of Web3

### Pros

1. *Decentralized Trust* - A blockchain based system promises each stakeholder full data records stored in a decentralized way. Any addition to the records need algorithmic validation from multiple nodes following a set consensus mechanism.
2. *Immutability -* Records created on a blockchain cannot be modified since any additional blocks are appended to the blockchain and broadcasted to multiple nodes.
3. *Traceability -* Blockchain enables a quicker settlement of trades or interactions because a single version of agreed upon data is available on a distributed ledger between organizations where a full history of records of the transaction is available.
4. *Data Security -* All transactions in a blockchain network are cryptographically secured and provide integrity and are considered very difficult to hack. The blockchain itself is an immutable and durable ledger and the transactions once recorded on the blockchain after a consensus among the peers cannot be altered or deleted.
5. *Privacy - D*ifferent entities communicate autonomously. Each transaction is between two public addresses unlinked to the actual names or home addresses. Blockchains implement privacy through the use of Zero Knowledge Proofs where encrypted transactions can be verified without the need for revealing data or identity.

### Cons

1. *Low Speed* -  Most Proof of Work blockchains have limited Block size and hence can have very limited speed of transactions (Chang et al., 2020). Bitcoin for example supports the creation of 1 block each 10 min, which is a median transaction rate of 7 transactions per second (Lee, 2019). Ethereum supports 15 transactions per second. In comparison Visa, based on centralized databases processes around 1700 transactions per second and can scale very rapidly (Khan et al., 2020).
2. *Cannot support large files* - It is a common practice to have the blockchain as a validator for documents, and storing the result of a Hash function on the blockchain which is very small in data size but sufficient to validate the authenticity of the original file. Hence a blockchain usually complements a central digital platform and does not need to always replace it.
3. *Energy Waste* - Mining, etc
4. *Necessity to have critical mass -* Blockchain is redundant where one or few highly trustworthy players are interacting and its implementation can be much more complex than traditional centralized databases. Once a Blockchain is implemented, to succeed it must have a certain critical mass to achieve the desired level of decentralization. Decentralization of decision-making and verification processes require high levels of participation of the community around these platforms either by producing, consuming, voting, coding or verifying transactions.

# Brainstorm

- *Job finder service* - Keeps a validated database of someone's employment history/certifications and makes job application status transparent
    - Problem with current system: People embellish their resumes with skills they don't have, and companies have no efficient way to validate information on a resume. At the same time, companies often leave applicants hanging for long periods of time, so public application status (application has been read, which stage they are at, etc) would be useful for applicants
- *Product certification of origin/quality standard* - Physical items are mapped to a NFT that contains information about product origin, environmental impact, and quality that is verified by the full supply chain.
    - Problem with current system: consumers have no idea where their belongings originate. They don't know the environmental impact, conditions of workers, or true quality of products.  It's difficult to verify a company's claims of quality because they often work behind closed doors. Putting data on a blockchain would create a mutually verifiable system.
- *Simple card game -* Less real-world application, but a fun, simple introduction to coding in blockchain. Could make poker, Coup Rebellion, or One Night Werewolf
