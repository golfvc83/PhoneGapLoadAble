	function evaluate(f_boardState, player){
		var value = player == human ? humanVar: comVar;
		var winningItem; 
		for(var i = 0; i< rowTocheck.length; i++){
			for(var f = 0; f < rowTocheck[i].length; f++){
				if(f_boardState[rowTocheck[i][f]] == 0){
					break;
				}else{
					if(f == 0){
						//winningItem = $(id).html();
						winningItem = f_boardState[rowTocheck[i][f]];
					}else{
						if(f_boardState[rowTocheck[i][f]] != winningItem){
							break;
						}
					}
					if(f == 2){
						if(winningItem == value){
							return true;
						}
						
					}
				}
				
			}
		}
		return false;
	}
	
	function isMovesLeft(f_boardState){
			for(var i = 0; i < f_boardState.length; i++){
				if(f_boardState[i] == 0) return true;
			}
		
		return false;
	}
	
	
	function callAI(){
		aiturn(boardState, 0, computer);
	}
	
	var human = false;
	var computer = true;
	
	var humanVar = 'x';
	var comVar = '0';
	
	function aiturn(board, depth, player){
		if(evaluate(boad, !player) )
			return -10 - depth;
		
		if(checkFul(board))
			return 0;
		
		var value = player == human ? humanVar: comVar;
		var max = -1000;
		var index = 0;
		for(var i = 0; i < 9; i+=){
			if(board[i] == 0){
				var newBoard.slice();
				newBoard[i] = value;
				
				var moveval = -aiturn(newboard, depth + 1, !player);
				if(moveval > max){
					max = moveval
					index = i;
				}
				
			}
			
		}
		
		if(depth == 0){
			console.log('the optimal move is '+ index);
		}
		
		return max;
		
	}