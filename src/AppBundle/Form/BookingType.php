<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\DateType;

class BookingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
             ->add('dateIn', DateType::class, [
                  'widget' => 'single_text',
             ])
             ->add('dateOut', DateType::class, [
                  'widget' => 'single_text',
             ])
             ->add('people', ChoiceType::class, [
                 'choices' => array_combine(range(1, 10), range(1, 10))
             ])
             ->add('hotelId', HiddenType::class);
        ;
    }
}
