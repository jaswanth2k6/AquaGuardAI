using Microsoft.AspNetCore.Mvc;
using AquaGuardAI.Models;
using AquaGuardAI.Services;

namespace AquaGuardAI.Controllers;

public class HomeController(PredictionService predictionService) : Controller
{
    public IActionResult Index() => View();
    public IActionResult Map() => View();
    public IActionResult Monitoring() => View();
    public IActionResult Disease() => View();
    public IActionResult Alerts() => View();
    public IActionResult Reports() => View();
    public IActionResult Awareness() => View();

    [HttpGet]
    public IActionResult Predict() => View();

    [HttpGet]
    public IActionResult Prediction() => View("Predict");

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Predict(WaterSample sample)
    {
        ViewBag.Sample = sample;
        ViewBag.Result = predictionService.Predict(sample);
        return View();
    }

    public IActionResult Error() => View();
}
