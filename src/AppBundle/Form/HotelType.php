<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class HotelType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('price', MoneyType::class, [
                'currency' => 'USD',
                'scale' => 0
            ])
            ->add('address')
            ->add('latitude', HiddenType::class)
            ->add('longitude', HiddenType::class)
        ;
    }
}
