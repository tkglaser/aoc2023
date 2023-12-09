{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}

start
  = cards

cards
  = head:card tail:cardTail* { return [head, ...tail] }

cardTail
  = eol c:card { return c }

card
  = "Card" ws cardId:integer ":" ws lhs:numlist ws "|" ws rhs:numlist
  { return { cardId, lhs, rhs } }

numlist
  = head:integer tail:numlistTail* { return [head,...tail] } 

numlistTail
  = ws ti:integer { return ti }

ws
  = " "+

integer
  = digits:[0-9]+ { return makeInteger(digits); }

eol
  = "\n"
