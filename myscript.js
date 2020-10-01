
class Cards {
   
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
          this.saveData = [];
     }
     //returnGame('.player-cards',document.querySelectorAll('.player-cards'))
     async return_Game(PlayerName, playerId){
       
      const get_deckId = await this.deck_id();
      const drawCard = await this.drawCards(get_deckId);
      const infoplayer = this.saveData.find(findv => findv.player===PlayerName);
      infoplayer.Scores=0;
      infoplayer.Status='';
      infoplayer.addnewCards = true;
      infoplayer.drawCard=[];
      infoplayer.gameStatus='';
      
        document.querySelectorAll(`${playerId} > img`).forEach(removeImage=>{
          removeImage.remove();
        });
       document.querySelector(playerId).innerHTML+=`<img src="${drawCard.cards[0].image}" style="height: 11rem;">`;
       infoplayer.drawCard.push(drawCard.cards[0]);
        
     }
     async CreateCardsPlayers (PlayerName, playerId){
        const get_deckId = await this.deck_id();
        const drawCards = await this.drawCards(get_deckId);
        playerId.innerHTML+=`<img src="${drawCards.cards[0].image}" style="height: 11rem;">`;
        this.saveData.push({
            player: PlayerName,
            drawCard: [drawCards.cards[0]],
            Scores: 0,
            addnewCards: true,
            Status: ''
        });
     }
     async CreateFlipCards (PlayerName, playerId, playerScore, showScore, showCards, addnewCards,callBack){
        const get_deckId = await this.deck_id();
        const drawCards = await this.drawCards(get_deckId);
        const addValueofDrawcards = this.saveData.find(findValue=>findValue.player===PlayerName);
        if(addValueofDrawcards.addnewCards===true){
          showCards ? playerId.innerHTML+=`<img src="${drawCards.cards[0].image}" style="height: 11rem;margin-left: -42px">` :
          playerId.innerHTML+=`<img src="https://opengameart.org/sites/default/files/card%20back%20red.png" style="height: 11.4rem;margin-left: -42px">`
          addValueofDrawcards.drawCard.push(drawCards.cards[0]);
          const firstcardPick = addValueofDrawcards.drawCard[0].value;
          const secondcardPick = addValueofDrawcards.drawCard[1].value;
          const additionalPickLenght = addValueofDrawcards.drawCard.length;
          const getAdditionalPick = addValueofDrawcards.drawCard[additionalPickLenght-1].value;
          addnewCards ? addValueofDrawcards.Scores += this.eqVal(getAdditionalPick, 0):
            addValueofDrawcards.Scores = this.eqVal(firstcardPick, secondcardPick)
          showScore ? playerScore.innerHTML=addValueofDrawcards.Scores : playerScore.innerHTML= '?'
          if(addValueofDrawcards.Scores > 21 ){
            addValueofDrawcards.Status = 'Bust';
            addValueofDrawcards.gameStatus = 'LOSE';
            addValueofDrawcards.addnewCards = false;
            callBack({
              status: 'Bust'
            });
          }
        }
         
     }
     eqVal(firstcardPick, secondcardPick) {
         const valueInt = {
             KING : 10,
             QUEEN: 10,
             JACK: 10,
             ACE: [11, 1]
         };
        const aceVal1 = valueInt[firstcardPick] !== undefined ? valueInt[firstcardPick] : firstcardPick;
        const aceVal2 = valueInt[secondcardPick] !== undefined ? valueInt[secondcardPick] : secondcardPick;
        return firstcardPick=='ACE'&&secondcardPick!=='ACE'?
          parseInt(aceVal2 <= 10? aceVal1[0]:aceVal1[1]) + parseInt(aceVal2):
        firstcardPick!=='ACE'&&secondcardPick==='ACE'?
          parseInt(aceVal1 <= 10? aceVal2[0]:aceVal2[1]) + parseInt(aceVal1):
        firstcardPick==='ACE'&&secondcardPick==='ACE'?
          aceVal1[0]+aceVal2[1]:parseInt(aceVal1)+parseInt(aceVal2)
     }
     playersPickChoice(PlayersName, callBack){
       const getPlayers_info = this.saveData.find(findValue=>findValue.player===PlayersName);
        if(getPlayers_info.Scores < 16){
           return callBack();
        }
     }
     //makeCards.displayNoneBtn(true, true, buttonBetVal,inputBetValue);
     displayNoneBtn(disabled, removebtn, ...args){
        args.forEach((callBack)=>{
          disabled ? callBack.removeAttribute('disabled')://Button disabled
           callBack.setAttribute('disabled','')
          removebtn ? callBack.removeAttribute('style') ://hide Button and input
           callBack.setAttribute('style','display: none')
        })
     }
     setBetValue_validate (PlayerName, setbetValue, callBack){
      const findPlayers = this.saveData.find(findValue=>findValue.player===PlayerName);
      if(parseInt(setbetValue.value) <= findPlayers.betvalue){
        findPlayers.betvalue -= parseInt(setbetValue.value);
        findPlayers.setbetValue = parseInt(setbetValue.value);
        callBack(findPlayers) 
      } else {
        alert('not enough bet value')
      }
     }
     async setBetDefaultvalue(PlayersName, defaulvalue, callBack){
        const get_deckId = await this.deck_id();
        await this.drawCards(get_deckId);
        const getPlayers = this.saveData.find(findValue=>findValue.player===PlayersName);
        getPlayers.betvalue = defaulvalue;
        return callBack(getPlayers);
     }

    revealCardsDealer(dealerid, computerClassid, callBack){
      const dealerinfo = this.saveData.find(findvalue=>findvalue.player===dealerid)
      let indexes = 0;
      dealerinfo.drawCard.forEach((getCards)=>{
        document.querySelectorAll(`${computerClassid} > img`)[indexes].src = getCards.image; 
        document.querySelectorAll(`${computerClassid} > img`)[indexes].style.height = '11rem';
        indexes +=1;
      });
      return callBack(dealerinfo)
    }

    definedWhosWinner(playersCard, computerCards){
     const Playerinfo = this.saveData.find(findVal => findVal.player===playersCard)
     const Computerinfo = this.saveData.find(findval => findval.player===computerCards);
      if(Playerinfo.Status==='Bust'&&Computerinfo.Status==='Bust'){
            Playerinfo.gameStatus='Draw';
            Computerinfo.gameStatus='Draw';
            Playerinfo.betvalue+=Playerinfo.setbetValue;
          } 
      else if(Playerinfo.Status!=='Bust'&&Computerinfo.Status==='Bust'){
            Computerinfo.betvalue-=Playerinfo.setbetValue;
            Playerinfo.betvalue+=(Playerinfo.setbetValue)*2;
            Playerinfo.gameStatus='Win';
            Computerinfo.gameStatus='Lose';
          }
      else if(Playerinfo.Status==='Bust'&&Computerinfo.Status!=='Bust'){
            Computerinfo.betvalue+=Playerinfo.setbetValue;
            Playerinfo.setbetValue=0;
            Playerinfo.gameStatus='Lose';
            Computerinfo.gameStatus='Win';
          }
      else if(Playerinfo.Status!=='Bust'&&Computerinfo.Status!=='Bust'){
              if(Playerinfo.Scores > Computerinfo.Scores){
                Computerinfo.betvalue-=Playerinfo.setbetValue;
                 Playerinfo.betvalue+=(Playerinfo.setbetValue)*2;
                 Playerinfo.gameStatus='Win';
                Computerinfo.gameStatus='Lose';
                }
              else if(Playerinfo.Scores === Computerinfo.Scores){
                  Playerinfo.gameStatus='Draw';
                  Computerinfo.gameStatus='Draw';
                  Playerinfo.betvalue+=Playerinfo.setbetValue;
                }
              else{
                Computerinfo.betvalue+=Playerinfo.setbetValue;
                 Playerinfo.setbetValue=0;
                 Playerinfo.gameStatus='Lose';
                 Computerinfo.gameStatus='Win';
              }
        } 
    }
 }

  



(function(){
    /* for all variables */
    const makeCards = new Cards; 
    const PlayerCards = document.querySelector('.player-cards');
    const ComputerCards = document.querySelector('.computer-cards');
    const ScorePlayer = document.querySelector('#totalPlayer');
    const ScoreComputer = document.querySelector('#totalComputer');
    const buttonStay =   document.querySelector('#Stay');
    const buttonHit = document.querySelector('#hitbtn');
    const buttonDeal = document.querySelector("#Deal");
    const buttonBetVal = document.querySelector("#setBetValue");
    const inputBetValue = document.querySelector('#betValueInput');
    const Computer_totalbetval = document.querySelector("#computerCurrent-betval");
    const Player_totalbetval = document.querySelector("#playerCurrent-betval");
    /* for all functions */
    makeCards.CreateCardsPlayers('ComputersCard', ComputerCards);
    makeCards.CreateFlipCards('ComputersCard', ComputerCards, ScoreComputer);
    makeCards.CreateCardsPlayers('PlayersCard', PlayerCards);
    makeCards.CreateFlipCards('PlayersCard', PlayerCards, ScorePlayer, true, true);
    makeCards.displayNoneBtn(false, false, buttonStay, buttonHit, buttonDeal);
    makeCards.setBetDefaultvalue('PlayersCard', 100000,call=>{
      Player_totalbetval.innerHTML = `&#8369;${call.betvalue.toLocaleString()}`;
    });
    makeCards.setBetDefaultvalue('ComputersCard', 1000000,call=>{
      Computer_totalbetval.innerHTML = `&#8369;${call.betvalue.toLocaleString()}`;
    });
    /* For all Buttons */
    buttonStay.addEventListener('click',function(){
      makeCards.displayNoneBtn(false, true, buttonStay, buttonHit);
      makeCards.displayNoneBtn(true, true, buttonDeal);
        makeCards.playersPickChoice('ComputersCard', function(){
        makeCards.CreateFlipCards('ComputersCard',ComputerCards, ScoreComputer, false, true, true,(callBack)=>{
        })
      });
      setTimeout(()=>alert('The Player Stayed his Card'),1000)
    });
    buttonHit.addEventListener('click',function(){
        makeCards.CreateFlipCards('PlayersCard', PlayerCards, ScorePlayer, true, true, true,(callBack)=>{
          ScorePlayer.innerHTML+= ` <i style="color: red">${callBack.status}</i>`;
        });
        makeCards.playersPickChoice('ComputersCard', function(){
          makeCards.CreateFlipCards('ComputersCard',ComputerCards, ScoreComputer, false, true, true,(callBack)=>{

          })
        });
    });
    buttonDeal.addEventListener('click',function(){
     makeCards.definedWhosWinner('PlayersCard','ComputersCard');
      makeCards.revealCardsDealer('ComputersCard','.computer-cards',callBack=>{
        ScoreComputer.innerHTML= `${callBack.Scores} `;
        Computer_totalbetval.innerHTML = `&#8369;${callBack.betvalue.toLocaleString()}`;
        ScoreComputer.innerHTML+=callBack.Status==='Bust'?`<i style="color: red">${callBack.Status}</i>`:``;
      })
        makeCards.revealCardsDealer('PlayersCard','.player-cards',callBack=>{
          ScorePlayer.innerHTML= `${callBack.Scores} `;
          Player_totalbetval.innerHTML = `&#8369;${callBack.betvalue.toLocaleString()}`;
          ScorePlayer.innerHTML+=callBack.Status==='Bust'?`<i style="color: red">${callBack.Status}</i>`:``;
        })
        makeCards.return_Game('ComputersCard','.computer-cards');
          makeCards.CreateFlipCards('ComputersCard', ComputerCards, ScoreComputer);
        makeCards.return_Game('PlayersCard','.player-cards');
         makeCards.CreateFlipCards('PlayersCard', PlayerCards, ScorePlayer, true, true);
         makeCards.displayNoneBtn(false, false, buttonStay, buttonHit, buttonDeal);
        makeCards.displayNoneBtn(true, true, buttonBetVal,inputBetValue);
        inputBetValue.value='';
        console.log(makeCards.saveData); 
    })
    buttonBetVal.addEventListener('click',function(){
      makeCards.setBetValue_validate('PlayersCard',inputBetValue,(TotalVal)=>{
        Player_totalbetval.innerHTML = `&#8369;${TotalVal.betvalue.toLocaleString()}`;
        makeCards.displayNoneBtn(true, true, buttonStay, buttonHit, buttonDeal);
        makeCards.displayNoneBtn(false, true, buttonBetVal, inputBetValue, buttonDeal);
      })
    });

})();

