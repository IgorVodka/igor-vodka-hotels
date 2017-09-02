<?php
namespace AppBundle\Service;

class HotelGenerator
{
    public function getName()
    {
        $names = [
            'Ritz',
            'Radisson',
            'Elite Hotel',
            'Motel',
            'Nice Inn'
        ];

        $index = array_rand($names);

        return $names[$index];
    }

    public function getAddress()
    {
        $addresses = [
            'Main Street',
            'Somewhere far',
            'Moscow',
            'Texas',
            'Montenegro'
        ];

        $index = array_rand($addresses);

        return $addresses[$index];
    }

    public function getPrice()
    {
        return (mt_rand() % 99) * 100 + 100;
    }
}
