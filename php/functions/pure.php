<?php
    function pureAdd(int $a, int $b){
        return $a + $b; // predictable. Output never changes because it does not depend on external variables
    }

    $g = 7;

    function impureAdd(int $a, int $b){
        global $g;
        $sum = $a + $b ;
        $g += $sum; //causes side-effects
        return $g; // output always changes due to dependence on external variables
    }

    var_dump(pureAdd(2, 3), impureAdd(2, 3));
    var_dump(pureAdd(2, 3), impureAdd(2, 3));
    var_dump(pureAdd(2, 3), impureAdd(2, 3));


