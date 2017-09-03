<?php
namespace AppBundle\Data;

use Symfony\Component\Validator\Constraints as Assert;

class BookingData {
    /**
     * @var date
     */
    private $dateIn;

    /**
     * @var date
     */
    private $dateOut;

    /**
     * @var int
     *
     * @Assert\Range(
     *     min = 1,
     *     max = 10,
     *     minMessage = "Must be at least 1 person",
     *     maxMessage = "Please not more than 10 people"
     * )
     */
    private $people;

    /**
     * @var date
     */
    private $hotelId;

    public function getDateIn()
    {
        return $this->dateIn;
    }

    public function setDateIn($dateIn)
    {
        $this->dateIn = $dateIn;
    }

    public function getDateOut()
    {
        return $this->dateOut;
    }

    public function setDateOut($dateOut)
    {
        $this->dateOut = $dateOut;
    }

    /**
     * @Assert\Callback
     */
    public function validateDates($context, $payload)
    {
        if($this->getDateOut() < $this->getDateIn()) {
            $context->buildViolation('Please check your dates.')
                ->atPath('dateOut')
                ->addViolation();
        }
    }

    public function getPeople()
    {
        return $this->people;
    }

    public function setPeople($people)
    {
        $this->people = $people;
    }

    public function getHotelId()
    {
        return $this->hotelId;
    }

    public function setHotelId($hotelId)
    {
        $this->hotelId = $hotelId;
    }
}
