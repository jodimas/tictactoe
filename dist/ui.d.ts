import { GameState, Team } from './game';
export declare class UI {
    private cells;
    private statusEl;
    private restartBtn;
    private boardEl;
    private selectionEl;
    private selectionXEl;
    private selectionOEl;
    private playerXSelect;
    private playerOSelect;
    private confirmXBtn;
    private confirmOBtn;
    private onCellClick;
    private onRestart;
    private onSelectX;
    private onSelectO;
    constructor(onCellClick: (index: number) => void, onRestart: () => void, onSelectX: (team: Team) => void, onSelectO: (team: Team) => void);
    private populateTeamSelects;
    private bindEvents;
    updatePlayerOSelect(selectedXId: string | null): void;
    showOXSelection(): void;
    private getTeamLogo;
    private getPlayerLabel;
    render(state: GameState): void;
}
//# sourceMappingURL=ui.d.ts.map