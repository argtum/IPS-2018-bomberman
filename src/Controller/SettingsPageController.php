<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @IsGranted("ROLE_USER")
 */
class SettingsPageController extends AbstractController
{
    /**
     * @Route("/settings", name="settings")
     */
    public function index()
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        return $this->render('settings_page/index.html.twig', []);
    }
}