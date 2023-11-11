import { Nostalgist } from 'https://esm.run/nostalgist';

const romLocation = {
    pokemon: window.location.origin + '/roms/pokemon_red.gba',
    fireEmblem: window.location.origin + '/roms/fire_emblem.gba',
    shiningSoul: window.location.origin + '/roms/shining_soul.gba',
};

let nostalgistInstance = null;

async function startGame(romPath) {
    nostalgistInstance = await Nostalgist.gba(romPath);
}

async function saveGame() {
    if (nostalgistInstance) {
        const fileName = prompt('Ingresa el nombre del archivo de guardado (con extensión .sav):');
        if (fileName) {
            try {
                const { state } = await nostalgistInstance.saveState();
                console.log({ state });
                const blob = new Blob([state], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error al guardar el estado del juego:', error);
            }
        }
    }
}

async function loadGame() {
    if (nostalgistInstance) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.sav';
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await nostalgistInstance.loadState(file);
                } catch (error) {
                    console.error('Error al cargar el archivo:', error);
                }
            }
        });
        fileInput.click();
    }
}

function setupGameButton(buttonSelector, romPath) {
    document.querySelector(buttonSelector).addEventListener('click', () => startGame(romPath));
}

setupGameButton('.playPokemon', romLocation.pokemon);
setupGameButton('.playFireEmblem', romLocation.fireEmblem);
setupGameButton('.playShiningSoul', romLocation.shiningSoul);

document.addEventListener('keydown', (event) => {
    if (event.key === 's') {
        saveGame();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'l') {
        loadGame();
    }
});