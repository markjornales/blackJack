
class Cards {
    saveData = [];
     constructor() {
          this.deck_id = async function() {
            const deck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            const deck_id = await deck.json();
            return deck_id.deck_id;
          }
          this.drawCards = async function(deck_id) {
              const deckcards = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
              const getDeckCards = await deckcards.json();
              return getDeckCards;
          }
     }
     async CreateCardsPlayers (PlayerName, playerId){
        const get_deckId = await this.deck_id();
        const drawCards = await this.drawCards(get_deckId);
        playerId.innerHTML+=`<img src="${drawCards.cards[0].image}" style="height: 11rem;">`;
        this.saveData.push({
            player: PlayerName,
            drawCard: [drawCards.cards[0]],
            Scores: 0
        });
     }
     async CreateFlipCards (PlayerName, playerId,playerScore,hideScore,showCards){
        const get_deckId = await this.deck_id();
        const drawCards = await this.drawCards(get_deckId);
        showCards ? playerId.innerHTML+=`<img src="${drawCards.cards[0].image}" style="height: 11rem;">` :
         playerId.innerHTML+=`<img src="https://opengameart.org/sites/default/files/card%20back%20red.png" style="height: 11.4rem;">`
        const addValueofDrawcards = this.saveData.find(findValue=>findValue.player===PlayerName);
        addValueofDrawcards.drawCard.push(drawCards.cards[0]);
        const firstcardPick = addValueofDrawcards.drawCard[0].value;
        const secondcardPick = addValueofDrawcards.drawCard[1].value;
        addValueofDrawcards.Scores = this.eqVal(firstcardPick, secondcardPick);
         hideScore ? playerScore.innerHTML=addValueofDrawcards.Scores : playerScore.innerHTML= '?'
     }
     eqVal(firstcardPick, secondcardPick) {
         const valueInt = {
             KING : 10,
             QUEEN: 10,
             JACK: 10,
             ACE: [11, 1]
         };
        const aceVal1 = valueInt[firstcardPick]!==undefined?valueInt[firstcardPick]:firstcardPick;
        const aceVal2 = valueInt[secondcardPick]!==undefined?valueInt[secondcardPick]:secondcardPick;
        return firstcardPick=='ACE'&&secondcardPick!=='ACE'?
          parseInt(aceVal2 <= 10? aceVal1[0]:aceVal1[1]) + parseInt(aceVal2):
        firstcardPick!=='ACE'&&secondcardPick==='ACE'?
          parseInt(aceVal1 <= 10? aceVal2[0]:aceVal2[1]) + parseInt(aceVal1):
        firstcardPick==='ACE'&&secondcardPick==='ACE'?
          aceVal1[0]+aceVal2[1]:parseInt(aceVal1)+parseInt(aceVal2)
     }
 }




(function(){
    const makeCards = new Cards; 
    const ScorePlayer = document.querySelector('#totalPlayer');
    const ScoreComputer = document.querySelector('#totalComputer');
    const PlayerCards = document.querySelector('.player-cards');
    const ComputerCards = document.querySelector('.computer-cards');
    makeCards.CreateCardsPlayers('PlayersCard', PlayerCards);
    makeCards.CreateFlipCards('PlayersCard', PlayerCards, ScorePlayer, true, true)
    makeCards.CreateCardsPlayers('ComputersCard', ComputerCards);
    makeCards.CreateFlipCards('ComputersCard', ComputerCards, ScoreComputer, false, false)
  
    document.querySelector('#Stay').addEventListener('click',function(){
          console.log(makeCards.saveData)
    })
     
})();

