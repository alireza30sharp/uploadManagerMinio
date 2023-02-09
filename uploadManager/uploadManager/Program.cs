using System.Globalization;
using uploadManager.Services;


AppContext.SetSwitch("Switch.Microsoft.AspNetCore.Mvc.EnableRangeProcessing", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(
    options =>
        options.AddPolicy(
            "AllowAll",
            builder =>
            {
                builder
                    // .SetIsOriginAllowed((host) => true)
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                // .AllowCredentials()
                ;
            }
        )
);
builder.Services.AddObjectStorageServices();

var app = builder.Build();

// Configure the HTTP request pipeline.-
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseAuthorization();
//app.UseHttpsRedirection();
app.UseStaticFiles();
// در صورتیکه تاریخ سیستم فارسی باشد مینیو خطای انقضا درخواست میدهد
app.UseWhen(
    context => Thread.CurrentThread.CurrentCulture.Name == "fa-IR",
    appBuilder =>
    {
        appBuilder.Use(
            async (context, next) =>
            {
                var current = new CultureInfo("fa-IR");
                current.DateTimeFormat = new DateTimeFormatInfo();
                current.DateTimeFormat.Calendar = new GregorianCalendar();
                Thread.CurrentThread.CurrentCulture = current;

                await next();
            }
        );
    }
);
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
