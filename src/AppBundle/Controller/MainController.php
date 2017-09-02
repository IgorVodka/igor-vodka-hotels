<?php
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use AppBundle\Entity\Hotel;
use AppBundle\Form\BookingType;
use AppBundle\Data\BookingData;

class MainController extends Controller
{
    /**
     * Display a hotel list.
     *
     * @Route("/", name="list-hotels")
     */
    public function listHotelsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $hotels = $em->getRepository(Hotel::class);

        $form = $this->createForm(BookingType::class, null, [
            'action' => $this->generateUrl('hotel-info')
        ]);

        return $this->render('main/hotels_list.html.twig', [
            'hotels' => $hotels->createQueryBuilder('h')
                                ->orderBy('h.price', 'DESC')
                                ->getQuery()
                                ->getResult(),
            'form' => $form->createView(),
        ]);
    }

    /**
     * Calculate and output hotel price.
     *
     * @Route("/hotel/info", name="hotel-info")
     */
    public function hotelInfoAction(Request $request)
    {
        $booking = new BookingData();

        $form = $this->createForm(BookingType::class, $booking);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $hotels = $em->getRepository(Hotel::class);
            $hotel = $em->getRepository(Hotel::class)
                        ->find($booking->getHotelId());

            if($hotel == null)
                throw new \Exception('Hotel does not exist.');

            $nights = $booking->getDateOut()->diff($booking->getDateIn())->days;
            $total = $hotel->getPrice() * $nights * $booking->getPeople();

            return $this->render('main/hotel_info.html.twig', [
                'booking' => $booking,
                'hotel' => $hotel,
                'nights' => $nights,
                'total' => $total,
            ]);
        } elseif(!$form->isValid()) {
            return new Response('Please do not hack this.');
        }
    }
}
