<?php
    class Connection{
        private static $instance = null;
        private function __construct(){}

        public static function getInstance(){
            if (static::$instance === null){ //Late Static Binding
                static::$instance = new static();
            }
            return static::$instance;
        }
    }

    $connection = Connection::getInstance();
