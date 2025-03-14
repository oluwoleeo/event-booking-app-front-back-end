<?php
    $largeArray = range(1, 1_000_000);
    $startTime = microtime(true);
    $startMem = memory_get_usage();

    $out = [];

    foreach ($largeArray as $number) {
        $out[] = $number * 2;
    }

    $endTime = microtime(true);
    $endMem = memory_get_usage();

    echo "Time: " . ($endTime - $startTime) . " seconds\n";
    echo "Memory: " . round(($endMem - $startMem)/1024/1024) . " mb\n";

    $startTime1 = microtime(true);
    $startMem1 = memory_get_usage();

    foreach ($largeArray as &$number) {
        $number = $number * 2;
    }

    $endTime1 = microtime(true);
    $endMem1 = memory_get_usage();

    echo "Time: " . ($endTime1 - $startTime1) . " seconds\n";
    echo "Memory: " . round(($endMem1 - $startMem1)/1024/1024) . " mb\n";