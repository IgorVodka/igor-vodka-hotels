<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Form\HotelType;
use AppBundle\Entity\Hotel;

class ManagementController extends Controller {
    /**
     * Create a new empty hotel entity.
     *
     * @Route("/hotel/add", name="add-hotel")
     */
    public function addHotelAction()
    {
        $em = $this->getDoctrine()->getManager();

        $hotel = new Hotel();
        $hotelGenerator = $this->container->get('app.hotel_generator');

        $hotel->setName($hotelGenerator->getName());
        $hotel->setAddress($hotelGenerator->getAddress());
        $hotel->setPrice($hotelGenerator->getPrice());
        $hotel->setLatitude(0);
        $hotel->setLongitude(0);

        $em->persist($hotel);
        $em->flush();

        return $this->redirectToRoute('edit-hotel', [
            'id' => $hotel->getId()
        ]);
    }

    /**
    * Display a basic hotel management form.
    *
    * @Route("/hotel/edit/{id}", name="edit-hotel")
    */
   	public function editHotelAction(Request $request, Hotel $hotel)
   	{
        $em = $this->getDoctrine()->getManager();
       	$form = $this->createForm(HotelType::class, $hotel);

       	$form->handleRequest($request);

       	if($form->isSubmitted() && $form->isValid()) {
           	$em->persist($hotel);
           	$em->flush();
       	}

        return $this->render('manage/hotel_edit.html.twig', [
            'form' => $form->createView(),
            'hotel' => $hotel,
        ]);
    }

    /**
     * Remove a hotel forever.
     *
     * @Route("/hotel/delete/{id}", name="delete-hotel")
     */
     public function deleteHotelAction(Hotel $hotel)
     {
         $em = $this->getDoctrine()->getManager();

         if($hotel != null) {
             $em->remove($hotel);
             $em->flush();
         }

         return $this->redirectToRoute('list-hotels');
     }
}
