using AquaGuardAI.Services;
var b=WebApplication.CreateBuilder(args); b.Services.AddControllersWithViews(); b.Services.AddSingleton<PredictionService>();
var app=b.Build(); if(!app.Environment.IsDevelopment()){app.UseExceptionHandler("/Home/Error");app.UseHsts();}
app.UseHttpsRedirection();app.UseStaticFiles();app.UseRouting();app.MapControllerRoute("default","{controller=Home}/{action=Index}/{id?}");app.Run();