# Template GitHub Actions per Luancer Brain Trainer

Questi file contengono le configurazioni per automatizzare la build, il rilascio e il deploy su GitHub:

1. **`deploy.yml`**: Deploy automatico su GitHub Pages ad ogni push sul branch `main`.
2. **`release.yml`**: Creazione automatica di una GitHub Release con bundle compresso (`.zip` e `.tar.gz`) quando viene creato un tag `v*` (o lanciato manualmente da GitHub Actions).

### Come attivarli (opzionale):
L'app AI Studio GitHub di default non include il permesso `workflow` per motivi di sicurezza di GitHub. 
Se desideri abilitare le GitHub Actions:
1. Vai sulla tua repository su GitHub.
2. Crea la cartella `.github/workflows/` direttamente dall'interfaccia web di GitHub (oppure tramite la tua CLI locale con un tuo Personal Access Token avente permessi di `workflow`).
3. Copia il contenuto di `deploy.yml` e `release.yml` all'interno di `.github/workflows/`.
